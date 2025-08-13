<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableAddNullableFieldsToDispositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dispositions', function (Blueprint $table) {
            $table->string('code_dff')->nullable()->change();
            $table->dateTime('date_arrival')->nullable()->change();
            $table->dateTime('date_dff')->nullable()->change();
            $table->decimal('weigth', 8, 2)->nullable()->change();
            $table->decimal('weigth_diff', 8, 2)->nullable()->change();
            $table->string('disposition_place')->nullable()->change();
            $table->string('code_invoice')->nullable()->change();
            $table->string('code_certification')->nullable()->change();
            $table->string('plate')->nullable()->change();
            $table->string('managment_report')->nullable()->change();
            $table->string('observations')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dispositions', function (Blueprint $table) {
            //
        });
    }
}
