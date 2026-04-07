<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFkExterManagementOnPackingGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('packing_guides', function (Blueprint $table) {
            $table->foreignId('exter_management_id')->after('inter_management_id')->nullable()->constrained('ext_managements');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('packing_guides', function (Blueprint $table) {
            //
        });
    }
}
