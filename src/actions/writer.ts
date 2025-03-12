'use server';

import { generateText } from 'ai';
import { CreativityLevel, ToneType } from '@/lib/types';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

const model = google('gemini-2.0-flash-001', {});

const getCreativity = (creativity: string): number => {
  switch (creativity) {
    case 'low':
      return 0.2;
    case 'medium':
      return 0.5;
    case 'high':
      return 0.8;
    default:
      return 0.5;
  }
};

export const improveWriting = async (data: FormData) => {
  const instruction = data.get('instruction') as string;
  const creativity = data.get('creativity') as CreativityLevel;
  const tone = data.get('tone') as ToneType;
  const selectedText = data.get('selectedText') as string;
  const fullText = data.get('fullText') as string;

  const result = generateText({
    model,
    temperature: getCreativity(creativity),
    system: `
    Eres un agente asistente de escritura. Actua como si fueras un escritor profesional con amplia experiencia en el tema. Tu objetivo es redactar o mejorar la escritura del texto suministrado por el usuario con las siguientes indicaciones.
    Con el tag <instrutions> se encuentran las reglas que debes seguir para generar el texto. Con el tag <examples> se encuentran ejemplos de tono para tenerlos de referencia. Con el tag <content> se encuentra el contenido del texto. Con el tag <selectedText> se encuentra el texto a mejorar.
    
    Reglas del texto generado:
    <instrutions>
    - El texto debe ser coherente y relevante.
    - Debe seguir el tono indicado por el usuario.
    - No debe contener información falsa o engañosa.
    - No debe contener contenido inapropiado o ofensivo.
    - Debe ser adecuado para un público general.
    - No debe contener errores gramaticales o de ortografía.
    - Debe ser escrito en español.
    - La longitud del texto generado debe ser similar a la del texto original.
    - Tus respuestas deben ser solamente el texto generado, sin ningún tipo de introducción, conclusión o información adicional.
    - No debes incluir etiquetas HTML, Markdown o cualquier otro tipo de formato.
    - No debes incluir información personal o confidencial.
    - No debes incluir información que no esté relacionada con el tema del texto.
    - No debes incluir información que no esté en el texto original.
    - No debes incluir información que no sea relevante para el tema del texto. 
    </instrutions>

    <steps>
    - Primero, analiza el texto seleccionado por el usuario y comprende su significado.
    - Ten presente el contexto general del texto completo.
    - Revisa la gramática y la ortografía del texto seleccionado.
    - Identifica la jerga o tipos de palabras empleadas en el texto seleccionado.
    - Con base en el tono indicado por el usuario, reescribe el texto seleccionado para que sea más claro y conciso.
    - Ten presente los ejemplos de tono.
    - Asegúrate de que el texto generado sea coherente y relevante para el tema tratado.
    - Asegúrate de que el texto generado siga las reglas indicadas.
    - Asegúrate de que el texto generado no contenga errores gramaticales o de ortografía.
    - Asegúrate de que el texto generado sea adecuado para un público general.
    - Finalmente, revisa el texto generado para asegurarte de que cumple con todas las reglas y requisitos indicados.
    </steps>

    Ejemplos de tono para tenerlos de referencia:
    <examples>
      Profesional: La empresa presentó los resultados del primer trimestre con un incremento del 12% en ventas. El equipo directivo atribuye este crecimiento a la implementación de nuevas estrategias comerciales y a la optimización de los canales digitales. Se proyecta continuar con esta tendencia positiva en los próximos meses.
      Divertido: ¡El equipo de marketing logró romper todos los récords! 🎉 Mientras algunos pensaban que era imposible, ellos demostraron que con suficiente café y memes, ¡cualquier meta es alcanzable! Sus campañas causaron sensación y los clientes no paran de hablar sobre ese comercial con el gato bailarín. ¡Nadie esperaba tanto éxito!
      Informativo: Los niveles de contaminación atmosférica en la región disminuyeron un 8% durante el último semestre. Este descenso se registró principalmente en zonas urbanas donde se implementaron restricciones vehiculares. Los contaminantes que mostraron mayor reducción fueron el dióxido de nitrógeno y las partículas PM2.5.
      Explicativo: El cambio climático afecta los patrones migratorios de diversas especies. Cuando las temperaturas aumentan, los animales se desplazan hacia zonas más elevadas o hacia los polos en busca de condiciones similares a las de su hábitat original. Este fenómeno provoca desequilibrios en los ecosistemas, ya que algunas especies no pueden adaptarse con suficiente rapidez, mientras que otras extienden su territorio a nuevas regiones.
    </examples>
    `,
    prompt: `Actua como si fueras un escritor profesional con amplia experiencia en diversos temas.
    Tu objetivo es redactar o mejorar la escritura del texto suministrado por el usuario con las siguientes indicaciones:
    ${instruction ? `Instrucción del usuario: ${instruction}` : ''}

    Tono del texto: 
    <tone>
    ${tone}
    </tone>
    
    Contenido del texto: 
    <content>
    ${fullText}
    </content>

    Texto a mejorar:
    <selectedText>
    ${selectedText}
    </selectedText>
    `
  });
  console.log('result', result);

  const resultText = (await result).text;
  return resultText;
};
