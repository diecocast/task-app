const { GoogleGenerativeAI } = require('@google/generative-ai');
const Task = require('../models/Task');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4000,
      }
    });
  }

  // Generar resumen de tareas (solo texto natural)
  async generateTasksSummary() {
    try {
      // Obtener todas las tareas de la base de datos
      const tasks = await Task.find({}).sort({ createdAt: -1 });
      
      if (tasks.length === 0) {
        return {
          success: true,
          summary: 'No tienes tareas registradas en el sistema. Es un buen momento para comenzar a organizar tu trabajo creando tu primera tarea.',
          generatedAt: new Date().toISOString()
        };
      }

      // Formatear tareas para el prompt
      const tasksString = tasks.map((task, index) => {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha límite';
        const status = task.status === 'pendiente' ? 'PENDIENTE' : 
                      task.status === 'en progreso' ? 'EN PROGRESO' : 'COMPLETADA';
        return `${index + 1}. [${status}] [${task.priority.toUpperCase()}] ${task.title} - ${task.description} (Vence: ${dueDate})`;
      }).join('\n');

      const prompt = `
Analiza las siguientes tareas y genera un resumen natural y conversacional en español:

${tasksString}

Por favor, proporciona un resumen natural que incluya:
- Una visión general del estado actual de las tareas
- Identificación de tareas importantes o urgentes
- Recomendaciones prácticas para mejorar la productividad
- Observaciones sobre patrones o tendencias

Responde con un texto natural y conversacional, como si fueras un asistente personal que está revisando las tareas conmigo. No uses formato JSON, solo texto corrido en español.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text().trim();
      
      return {
        success: true,
        summary: summary,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generando resumen con Gemini:', error);
      throw new Error(`Error al generar resumen: ${error.message}`);
    }
  }

  // Crear tarea desde mensaje de texto con schema estructurado
  async createTaskFromMessage(message) {
    try {
      // Schema de respuesta basado en el modelo Task
            const taskSchema = {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Título conciso y descriptivo de la tarea (máximo 100 caracteres)"
          },
          description: {
            type: "string",
            description: "Descripción detallada de la tarea (máximo 500 caracteres)"
          },
          status: {
            type: "string",
            enum: ["pendiente", "en progreso", "completada"],
            description: "Estado de la tarea, siempre debe ser 'pendiente' para tareas nuevas"
          },
          priority: {
            type: "string",
            enum: ["baja", "media", "alta"],
            description: "Prioridad de la tarea basada en el contexto del mensaje"
          },
          dueDate: {
            type: "string",
            description: "Fecha límite en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) o cadena vacía si no se especifica",
            format: "date-time"
          },
          tags: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Array de etiquetas relevantes extraídas del contexto"
          }
        },
        required: ["title", "description", "status", "priority"]
      };

      const prompt = `
Analiza el siguiente mensaje y extrae la información necesaria para crear una tarea:

"${message}"

Basándote en el mensaje, determina:
1. Título de la tarea (conciso y descriptivo, máximo 100 caracteres)
2. Descripción detallada (máximo 500 caracteres)
3. Prioridad (baja, media, alta) basada en el contexto y urgencia
4. Estado inicial (siempre 'pendiente' para tareas nuevas)
5. Fecha límite si se menciona explícitamente (formato ISO 8601)
6. Etiquetas relevantes basadas en el contenido

Si el mensaje no contiene información suficiente para crear una tarea válida, genera una tarea genérica basada en el contexto disponible.`;

      // Inicializar el modelo con configuración específica para JSON estructurado
      const structuredModel = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4000,
          responseSchema: taskSchema
        }
      });

      const result = await structuredModel.generateContent({
        contents: [{ 
          role: "user", 
          parts: [{ text: prompt }] 
        }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: taskSchema
      }
      });

      const response = await result.response;
      let taskData;
      
      try {
        taskData = JSON.parse(response.text());
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Raw response:', response.text());
        
        // Intentar extraer JSON de la respuesta
        const jsonMatch = response.text().match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          taskData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No se pudo extraer JSON válido de la respuesta de Gemini');
        }
      }
      
      // Validar que los campos requeridos estén presentes
      if (!taskData.title || !taskData.description) {
        throw new Error('El mensaje no contiene información suficiente para crear una tarea');
      }
      
      // Asegurar que el status sea siempre 'pendiente' para tareas nuevas
      taskData.status = 'pendiente';
      
      // Validar que la fecha sea futura si se proporciona
     let processedDueDate = null;
      if (taskData.dueDate && taskData.dueDate.trim() !== '') {
        const dueDate = new Date(taskData.dueDate);
        if (dueDate > new Date()) {
          processedDueDate = dueDate;
        }
      }
      
      // Crear la tarea en la base de datos
      const task = new Task({
        title: taskData.title,
        description: taskData.description,
        status: 'pendiente',
        priority: taskData.priority || 'media',
        dueDate: processedDueDate,
        tags: taskData.tags || []
      });
      
      const savedTask = await task.save();
      
      return {
        success: true,
        message: 'Tarea creada exitosamente desde el mensaje',
        task: savedTask,
        originalMessage: message,
        extractedData: taskData
      };
    } catch (error) {
      console.error('Error creando tarea desde mensaje:', error);
      throw new Error(`Error al crear tarea desde mensaje: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();