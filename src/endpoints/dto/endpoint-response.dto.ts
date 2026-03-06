import { ApiProperty } from "@nestjs/swagger";

export class EndpointResponseDto {
    @ApiProperty({
        description: "Endpoint's unique identifier",
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    id: string;

    @ApiProperty({
        description: "Endpoint's name",
        example: "Get User Data",
    })
    name: string;

    @ApiProperty({
        description: "Endpoint's URL",
        example: "/api/user/data",
    })
    url: string;

    @ApiProperty({
        description: "HTTP method for the endpoint",
        example: "GET",
    })
    method: string;

    @ApiProperty({
        description: "Endpoint's headers",
        example: { "Authorization": "Bearer token" },
        required: false,
        nullable: true,
    })
    headers?: Record<string, string> | null;

    @ApiProperty({
        description: "Endpoint's body",
        example: '{"userId": 123}',
        required: false,
        nullable: true,
    })
    body?: string | null;

    @ApiProperty({
        description: "Endpoint's interval for monitoring in milliseconds",
        example: 300,
    })
    interval: number;

    @ApiProperty({
        description: "Endpoint's timeout for monitoring in milliseconds",
        example: 10000,
    })
    timeout: number;

    @ApiProperty({
        description: "Whether the endpoint is active for monitoring",
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: "Endpoint's description",
        example: "This endpoint retrieves user data based on the provided user ID.",
        required: false,
        nullable: true,
    })
    description?: string | null;

    @ApiProperty({
        description: "Date when the endpoint was created",
        example: "2024-01-15T10:30:00.000Z",
    })
    createdAt: Date;

    @ApiProperty({
        description: "Date when the endpoint was last updated",
        example: "2024-01-15T10:30:00.000Z",
    })
    updatedAt: Date;

    @ApiProperty({
        description: "ID of the user who owns this endpoint",
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    userId: string;
}
