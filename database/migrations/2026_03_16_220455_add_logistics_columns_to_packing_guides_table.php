<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLogisticsColumnsToPackingGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('packing_guides', function (Blueprint $table) {
            $table->date('sailing_date')->nullable();
            $table->string('barge')->nullable();
            $table->integer('packages')->nullable();
            $table->string('packaging_type')->nullable();
            $table->decimal('crane_weight_kg', 12, 2)->nullable();
            $table->string('carrier_guide')->nullable();
            $table->string('plate_number')->nullable();
            $table->string('greencare_guide')->nullable();
            $table->date('disposal_date')->nullable();
            $table->string('weighing_receipt')->nullable();
            $table->decimal('ddff_weight_kg', 12, 2)->nullable();
            $table->string('disposal_company')->nullable();
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
            $table->dropColumn([
                'sailing_date',
                'barge',
                'packages',
                'packaging_type',
                'crane_weight_kg',
                'carrier_guide',
                'plate_number',
                'greencare_guide',
                'disposal_date',
                'weighing_receipt',
                'ddff_weight_kg',
                'disposal_company',
            ]);
        });
    }
}
