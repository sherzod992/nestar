import { Query, Resolver } from "@nestjs/graphql";
import e from "express";

@Resolver()
export class AppResolver {
    @Query(() => String)
    public satHello(): string {
        return 'GraphQL API is running!';
    }
}