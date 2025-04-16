declare module 'zxcvbn' {
    const value: (password: string) => {
      score: number;
      feedback: {
        suggestions: string[];
        warnings: string[];
      };
    };
    export = value;
  }  