// Dynamic tokenization utility to reduce initial bundle size
let tiktokenModule: any = null;

// Lazy load tiktoken only when needed
const loadTiktoken = async () => {
  if (!tiktokenModule) {
    try {
      // Dynamic import to avoid including tiktoken in initial bundle
      tiktokenModule = await import('tiktoken');
    } catch (error) {
      console.warn('Failed to load tiktoken:', error);
      throw error;
    }
  }
  return tiktokenModule;
};

// Tokenization utility with fallback
export const estimateTokens = async (text: string, model?: string): Promise<number> => {
  if (!text?.trim()) return 0;
  
  try {
    // Try to load tiktoken dynamically
    const tiktoken = await loadTiktoken();
    
    // Determine encoding based on model
    let encoding;
    if (model && (model.includes('gpt-4') || model.includes('gpt-3.5'))) {
      encoding = tiktoken.encoding_for_model(model as any);
    } else {
      // Use cl100k_base encoding for other models (Claude, Gemini, etc.)
      encoding = tiktoken.get_encoding('cl100k_base');
    }
    
    const tokens = encoding.encode(text);
    encoding.free(); // Free memory
    return tokens.length;
  } catch (error) {
    console.warn('Tiktoken unavailable, using word-based estimation:', error);
    
    // Fallback to improved word-based estimation
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words * 1.3); // More accurate multiplier for tokens
  }
};

// Lightweight fallback for immediate estimation (synchronous)
export const estimateTokensFallback = (text: string): number => {
  if (!text?.trim()) return 0;
  
  // Improved word-based estimation
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words * 1.3); // Approximation: 1.3 tokens per word
}; 