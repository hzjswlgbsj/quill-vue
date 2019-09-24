export interface editorChangeParams {
  html: string,
  text: string,
  quill: any, 
  change: {
    delta: any,
    oldDelta: any,
    source: string,
  } 
}


