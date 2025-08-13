<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewColumnsToPackingGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('packing_guides', function (Blueprint $table) {
            $table->foreignId('id_disposition')->after('status')->nullable()->constrained('dispositions');

            $table->boolean('stat_transport_departure')->after('status')->nullable();
            $table->boolean('stat_arrival')->after('status')->nullable();

            $table->string('gc_code')->after('status')->nullable();
            $table->dateTime('date_retirement')->after('status')->nullable();
            $table->dateTime('date_arrival')->after('status')->nullable();


            $table->string('manifest_code')->after('status')->nullable();
            $table->string('ppc_code')->after('status')->nullable();
            $table->string('destination')->after('status')->nullable();
            $table->string('shipping_type')->after('status')->nullable();
            $table->string('date_departure')->after('status')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('to_packing_guides', function (Blueprint $table) {
            //
        });
    }
}
