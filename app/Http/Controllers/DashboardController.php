<?php

namespace App\Http\Controllers;

use App\Models\{GuideWaste};
use App\Services\DashboardService;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private $dashboardService;

    public function __construct(DashboardService $service)
    {
        $this->dashboardService = $service;
    }

    public function index(Request $request)
    {
        if ($request->ajax()) {
            return $this->dashboardService->getDashboardData($request, 'INTER');
        }

        [
            $min_date,
            $max_date,
            $lots,
            $locations,
            $projects,
            $companies,
            $classes,
            $wasteTypes,
            $groups
        ] = $this->dashboardService->getDashBoardInitialData($this->dashboardService->internmentWastesQuery(), 'INTER');

        return view('principal.common.dashboard.index', compact(
            'min_date',
            'max_date',
            'lots',
            'locations',
            'projects',
            'companies',
            'classes',
            'wasteTypes',
            'groups'
        ));
    }


    public function interManagementIndex(Request $request)
    {
        if ($request->ajax()) {
            return $this->dashboardService->getDashboardData($request, 'INTMANAGEMENT');
        }

        [
            $min_date,
            $max_date,
            $lots,
            $locations,
            $projects,
            $companies,
            $classes,
            $wasteTypes,
            $groups
        ] = $this->dashboardService->getDashBoardInitialData($this->dashboardService->getInterManagementQuery(), 'INTMANAGEMENT');


        return view('principal.common.dashboard.int_dashboard', compact(
            'min_date',
            'max_date',
            'lots',
            'locations',
            'projects',
            'companies',
            'classes',
            'wasteTypes',
            'groups'
        ));
    }


    public function getMonthsByYear(Request $request)
    {
        $year = $request->year;

        $months = $this->dashboardService->internmentWastesQuery()
            ->whereYear('internment_guides.created_at', intval($year))
            ->selectRaw('DISTINCT MONTH(internment_guides.created_at) AS month')
            ->orderByRaw('MONTH(internment_guides.created_at)')
            ->get()->pluck('month');

        $options_html = view('principal.common.dashboard.components._month_options', compact('months'))->render();

        return response()->json([
            'html' => $options_html
        ]);
    }
}
