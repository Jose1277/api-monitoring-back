import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateEndpointDto {
    @ApiProperty({
        description: "Endpoint's name",
        example: "Get User Data",
        required: true,
    })
    @IsString({ message: "Name must be a text string" })
    @MinLength(3, { message: "Name must be at least 3 characters long" })
    @MaxLength(50, { message: "Name must be at most 50 characters long" })
    name: string;

    @ApiProperty({
        description: "Endpoint's URL",
        example: "/api/user/data",
        required: true,
    })
    @IsString({ message: "URL must be a text string" })
    @MinLength(5, { message: "URL must be at least 5 characters long" })
    @MaxLength(100, { message: "URL must be at most 100 characters long" })
    url: string;

    @ApiProperty({
        description: "HTTP method for the endpoint",
        example: "GET",
        required: true,
    })
    @IsString({ message: "Method must be a text string" })
    @MinLength(3, { message: "Method must be at least 3 characters long" })
    @MaxLength(10, { message: "Method must be at most 10 characters long" })
    method: string;

    @ApiProperty({
        description: "Endpoint's headers (optional)",
        example: {
            "Authorization": "Bearer token"
        },
        required: false,
    })
    @IsString({ message: "Headers must be a text string" })
    @MaxLength(500, { message: "Headers must be at most 500 characters long" })
    headers?: string;

    @ApiProperty({
        description: "Endpoint's body (optional)",
        example: {
            "userId": 123,
            "data": "Sample data"
        },
        required: false,
    })
    @IsString({ message: "Body must be a text string" })
    @MaxLength(2000, { message: "Body must be at most 2000 characters long" })
    body?: string;

    @ApiProperty({
        description: "Endpoint's description (optional)",
        example: "This endpoint retrieves user data based on the provided user ID.",
        maxLength: 200,
        required: false,
    })
    @IsString({ message: "Description must be a text string" })
    @MaxLength(200, { message: "Description must be at most 200 characters long" })
    description?: string;

    @ApiProperty({
        description: "Endpoint's interval for monitoring in milliseconds",
        example: 300,
        required: true,
    })
    @IsNumber({}, { message: "Interval must be a number" })
    @Min(1000, { message: "Interval must be at least 1000ms (1 second)" })
    @Max(86400000, { message: "Interval must be at most 86400000ms (24 hours)" })
    interval: number;

    @ApiProperty({
        description: "Endpoint's timeout for monitoring in milliseconds",
        example: 5000,
        required: true,
    })
    @IsNumber({}, { message: "Timeout must be a number" })
    @Min(1000, { message: "Timeout must be at least 1000ms (1 second)" })
    @Max(60000, { message: "Timeout must be at most 60000ms (60 seconds)" })
    timeout: number;

    @ApiProperty({
        description: "User ID associated with the endpoint",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: true,
    })
    @IsString({ message: "User ID must be a text string" })
    @MinLength(3, { message: "User ID must be at least 3 characters long" })
    @MaxLength(36, { message: "User ID must be at most 36 characters long" })
    userId: string;
}
