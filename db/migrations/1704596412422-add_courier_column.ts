import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourierColumn1704596412422 implements MigrationInterface {
    name = 'AddCourierColumn1704596412422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" ADD "courier" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" DROP COLUMN "courier"`);
    }

}
