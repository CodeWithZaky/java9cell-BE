import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentMethodColumn1704675175362 implements MigrationInterface {
    name = 'AddPaymentMethodColumn1704675175362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" ADD "payment_method" character varying NOT NULL DEFAULT 'bri'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_products" DROP COLUMN "payment_method"`);
    }

}
