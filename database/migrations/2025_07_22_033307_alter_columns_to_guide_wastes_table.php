<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterColumnsToGuideWastesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('guide_wastes', function (Blueprint $table) {
            $table->string('gestion_type')->nullable()->after('id');
            $table->unsignedBigInteger('id_packageType')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('guide_wastes', function (Blueprint $table) {
            //
        });
    }
}
