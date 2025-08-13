<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToDeparturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('departures', function (Blueprint $table) {
            $table->foreignId('id_disposition')->after('date_departure')->nullable()->constrained('dispositions');

            $table->boolean('stat_transport_departure')->after('date_departure')->nullable();
            $table->boolean('stat_arrival')->after('date_departure')->nullable();

            $table->string('gc_code')->after('date_departure')->nullable();
            $table->dateTime('date_retirement')->after('date_departure')->nullable();
            $table->dateTime('date_arrival')->after('date_departure')->nullable();

            $table->string('manifest_code')->after('date_departure')->nullable();
            $table->string('ppc_code')->after('date_departure')->nullable();
            $table->string('destination')->after('date_departure')->nullable();
            $table->string('shipping_type')->after('date_departure')->nullable();
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
