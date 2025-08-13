<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterApprovantIdColumnOnInternmentGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('internment_guides', function (Blueprint $table) {
            $table->unsignedBigInteger('id_approvant')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('internment_guides', function (Blueprint $table) {
            $table->unsignedBigInteger('id_approvant')->change();
        });
    }
}
