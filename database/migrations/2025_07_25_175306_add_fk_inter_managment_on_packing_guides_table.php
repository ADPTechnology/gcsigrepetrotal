<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFkInterManagmentOnPackingGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('packing_guides', function (Blueprint $table) {
            $table->foreignId('inter_management_id')->after('id_disposition')->nullable()->constrained('inter_managements');
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
