<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToGuideWastesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('guide_wastes', function (Blueprint $table) {
            $table->boolean('is_residue')->after('stat_disposition')->default(false)->nullable();
            $table->string('partition_number')->after('stat_disposition')->nullable();
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
