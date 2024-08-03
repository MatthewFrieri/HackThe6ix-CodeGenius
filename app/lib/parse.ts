import { Section } from "../components/FileView";

export function parseAnnotations(annotations: string) {

    const parts = annotations.split(']')

    const sections: Section[] = [];
    
    parts.forEach((part, index) => {
        if (index === 0){ 
            const firstAnnotation = part.slice(2, -1).split(',')
            const firstFeedback = firstAnnotation.slice(2, firstAnnotation.length).join(',')
            const firstSection = {
                startLine: Number(firstAnnotation[0]),
                endLine: Number(firstAnnotation[1]),
                feedback: firstFeedback.slice(2, firstFeedback.length)
            }
            sections.push(firstSection)
        } else {
            if (index === parts.length - 2 || index === parts.length - 1) { 
                return;
            }
            
            const annotationN = part.slice(3, part.length).split(',')
            const feedbackN = annotationN.slice(2, annotationN.length).join(',')
            const sectionN = {
                startLine: Number(annotationN[0]),
                endLine: Number(annotationN[1]),
                feedback: feedbackN.slice(2, feedbackN.length)
            }
            sections.push(sectionN)
        }
    })

    return sections
  }
  
 