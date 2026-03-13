import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class HealthCheckResponseDto {
    @ApiProperty({
        description: 'id of the health check',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsString({ message: "ID must be a text string" })
    id: string;

    @ApiProperty({
        description: 'status code of the health check',
        example: 200
    })
    @IsNumber({}, { message: "Status code must be a number" })
    @IsOptional()
    statusCode?: number;

    @ApiProperty({
        description: 'response time of the health check in milliseconds',
        example: 150
    })
    @IsNumber({}, { message: "Response time must be a number" })
    responseTime: number;

    @ApiProperty({
        description: 'Indicates if the endpoint is up or down',
        example: true
    })
    isUp: boolean;

    @ApiProperty({
        description: 'Error message'
        , example: 'Connection timeout'
    })
    @IsOptional()
    errorMessage?: string;

    @ApiProperty({
        description: 'Error Type '
        , example: 'TimeoutError'
    })
    @IsOptional()
    errorType?: string;

    @ApiProperty({
        description: 'Timestamp of when the health check was performed',
        example: '2024-06-01T12:00:00Z'
    })
    @IsDate({ message: "Checked at must be a valid date" })
    checkedAt: Date;

    @ApiProperty({
        description: 'ID of the endpoint that was checked',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsString({ message: "Endpoint ID must be a text string" })
    endpointId: string;


}