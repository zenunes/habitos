/**
 * Utilitario simples para padronizacao de logs
 */
export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(JSON.stringify({ level: "info", message, meta, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(JSON.stringify({ level: "warn", message, meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: unknown, meta?: unknown) => {
    const errorDetails = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    
    console.error(JSON.stringify({ 
      level: "error", 
      message, 
      error: errorDetails, 
      meta, 
      timestamp: new Date().toISOString() 
    }));
  }
};
