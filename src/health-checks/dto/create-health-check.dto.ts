import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateHealthCheckDto {
    @ApiProperty({
        description: "HTTP status code returned by the endpoint",
        example: 200,
        required: false,
    })
    @IsOptional()
    @IsNumber({}, { message: "Status code must be a number" })
    statusCode?: number;

    @ApiProperty({
        description: "Response time in milliseconds",
        example: 120,
        required: true,
    })
    @IsNumber({}, { message: "Response time must be a number" })
    @Min(0, { message: "Response time must be a positive number" })
    responseTime: number;

    @ApiProperty({
        description: "Whether the endpoint is up",
        example: true,
        required: true,
    })
    @IsBoolean({ message: "isUp must be a boolean" })
    isUp: boolean;

    @ApiProperty({
        description: "Error message if the check failed",
        example: "Connection refused",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "Error message must be a text string" })
    @MaxLength(500, { message: "Error message must be at most 500 characters long" })
    errorMessage?: string;

    @ApiProperty({
        description: "Type of error if the check failed",
        example: "ECONNREFUSED",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "Error type must be a text string" })
    @MaxLength(100, { message: "Error type must be at most 100 characters long" })
    errorType?: string;

    @ApiProperty({
        description: "Response body from the endpoint",
        example: '{"status": "ok"}',
        required: false,
    })
    @IsOptional()
    @IsString({ message: "Response body must be a text string" })
    @MaxLength(5000, { message: "Response body must be at most 5000 characters long" })
    responseBody?: string;

    @ApiProperty({
        description: "Total duration of the check in milliseconds",
        example: 135,
        required: false,
    })
    @IsOptional()
    @IsNumber({}, { message: "Check duration must be a number" })
    @Min(0, { message: "Check duration must be a positive number" })
    checkDuration?: number;

    @ApiProperty({
        description: "ID of the endpoint being checked",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: true,
    })
    @IsString({ message: "Endpoint ID must be a text string" })
    @MaxLength(36, { message: "Endpoint ID must be at most 36 characters long" })
    endpointId: string;
}
