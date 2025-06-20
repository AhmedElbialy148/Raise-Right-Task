import { HttpException, InternalServerErrorException } from "@nestjs/common";

export function handleError(error: any) {
  // Check if the error is a build-in exception
  if (error instanceof HttpException) {
    // Re-throw the original exception
    throw error; 
  }
  // Handle unexpected errors
  throw new InternalServerErrorException('An error occurred. Please try again later.');
}