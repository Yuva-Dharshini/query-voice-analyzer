
export interface SpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Use the browser's SpeechRecognition API
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }

  startRecording(options: SpeechRecognitionOptions = {}) {
    if (!this.recognition) {
      options.onError?.('Speech recognition is not supported in this browser.');
      return false;
    }

    if (this.isRecording) {
      this.stopRecording();
    }

    this.recognition.continuous = options.continuous ?? true;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.lang = options.language ?? 'en-US';

    let finalTranscript = '';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      options.onResult?.(finalTranscript + interimTranscript);
    };

    this.recognition.onstart = () => {
      this.isRecording = true;
      options.onStart?.();
    };

    this.recognition.onend = () => {
      if (this.isRecording) {
        this.isRecording = false;
        options.onEnd?.();
      }
    };

    this.recognition.onerror = (event) => {
      options.onError?.(event.error);
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      options.onError?.('Failed to start speech recognition: ' + error);
      return false;
    }
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
        this.isRecording = false;
        return true;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        return false;
      }
    }
    return false;
  }

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  isActive(): boolean {
    return this.isRecording;
  }
}

export const speechRecognition = new SpeechRecognitionService();
