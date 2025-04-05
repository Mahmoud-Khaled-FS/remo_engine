class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly errorCode: string = 'UNKNOWN',
    public readonly shouldLog: boolean = true,
  ) {
    super(message);
  }
}

export default AppError;
