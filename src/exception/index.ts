export class ValidationException extends Error {
    status: number;
  
    constructor(message: any) {
      super(message); 
      this.name = this.constructor.name; 
      this.status = 400;
  
      Object.setPrototypeOf(this, ValidationException.prototype);
    }
}

export class ServiceException extends Error {
  status: number;

  constructor(message: string) {
    super(message); 
    this.name = this.constructor.name; 
    this.status = 500;

    Object.setPrototypeOf(this, ServiceException.prototype);
  }
}

export class NotFoundException extends Error {
  status: number;

  constructor(message: any) {
    super(message); 
    this.name = this.constructor.name; 
    this.status = 404;

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class AuthFailedException extends Error {
  status: number;

  constructor(message: any) {
    super(message); 
    this.name = this.constructor.name; 
    this.status = 401;

    Object.setPrototypeOf(this, AuthFailedException.prototype);
  }
}

export class AccessDeniedException extends Error {
  status: number;

  constructor(message: any) {
    super(message); 
    this.name = this.constructor.name; 
    this.status = 403;

    Object.setPrototypeOf(this, AccessDeniedException.prototype);
  }
}



  