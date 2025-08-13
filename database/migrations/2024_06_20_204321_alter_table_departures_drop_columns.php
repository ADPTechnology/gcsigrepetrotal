<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableDeparturesDropColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('departures', function (Blueprint $table) {
            $table->dropColumn(['code_green_care']);
            $table->dropColumn(['destination']);
            $table->dropColumn(['plate']);
            $table->dropColumn(['weigth']);
            $table->dropColumn(['weigth_diff']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('departures', function (Blueprint $table) {
            //
        });
    }
}
