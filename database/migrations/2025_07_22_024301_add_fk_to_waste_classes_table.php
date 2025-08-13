<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFkToWasteClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('waste_classes', function (Blueprint $table) {
            $table->foreignId('status_id')->after('id')->nullable()->constrained('waste_status');
            $table->foreignId('group_id')->after('id')->nullable()->constrained('groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('waste_classes', function (Blueprint $table) {
            //
        });
    }
}
