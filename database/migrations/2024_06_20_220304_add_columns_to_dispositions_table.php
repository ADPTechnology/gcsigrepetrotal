<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToDispositionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dispositions', function (Blueprint $table) {
            $table->double('weigth_diff_init', 8, 2)->after('id')->nullable();
            $table->double('weigth_init', 8, 2)->after('id')->nullable();
            $table->string('plate_init')->after('id')->nullable();
            $table->string('destination')->after('id')->nullable();
            $table->dateTime('date_departure')->after('id')->nullable();
            $table->string('code_green_care')->after('id')->nullable();
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
