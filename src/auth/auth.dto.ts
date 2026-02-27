import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, Min, MinLength, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isStrongPassword",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== "string") return false;

                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumber = /[0-9]/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && value.length >= 8 && value.length <= 20;
                },
                defaultMessage(args: ValidationArguments) {
                    return "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
                },
            },
        });
    };
}

export class RegisterDTO {
    @ApiProperty({
        description: "User's email address",
        example: "jose@example.com",
        required: true,
    })
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @ApiProperty({
        description: "User's password",
        example: "P@ssw0rd!",
        minLength: 8,
        maxLength: 20,
        required: true,
    })
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        description: "User's name (optional)",
        example: "José Oliveira",
        maxLength: 50,
        required: false,
    })
    @IsString({ message: "Name must be a text string" })
    @IsOptional()
    @MaxLength(50, { message: "Name must be at most 50 characters long" })
    name?: string;
}

export class LoginDTO {

    @ApiProperty({
        description: "User's email address",
        example: "jose@gmail.com",
        required: true,
    })
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @ApiProperty({
        description: "User's password",
        example: "P@ssw0rd!",
        minLength: 8,
        maxLength: 20,
        required: true,
    })
    @IsString({ message: "Password must be a text string" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @MaxLength(20, { message: "Password must be at most 20 characters long" })
    password: string;
}

export class JwtPayload {
    sub: string;
    email: string;
    username: string;
}