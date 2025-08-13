<?php

namespace App\Console\Commands;

use App\Models\{IntermentGuide};
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateGuideStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'guides:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualizar el estado de las guías después de 7 días';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $date = Carbon::now()->subDays(7);

        IntermentGuide::where('stat_rejected', 0)
                        ->where(function($query){
                            $query->where('stat_approved', 0)
                                ->orWhere('stat_recieved', 0)
                                ->orWhere('stat_verified', 0);
                        })
                        ->where('created_at', '<', $date)
                        ->update([
                            'stat_rejected' => 1,
                            'date_rejected' => Carbon::now()->toDateTime()
                        ]);

        $this->info('Estado de las guías actualizado correctamente');
    }
}
