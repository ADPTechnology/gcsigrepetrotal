@extends('principal.common.layouts.masterpage')

@section('content')
    <div class="row content">

        <div class="title-page-header">
            <div class="card page-title-container">
                <div class="card-header">
                    <div class="total-width-container">
                        <h4>REPORTE INTERNAMIENTO</h4>
                    </div>
                </div>
            </div>

            @include('principal.common.dashboard.components._dashboard_content', ['route' => route('dashboard.interIndex')])

        </div>
    </div>
@endsection

@section('extra-scripts')
    <script src=https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js crossorigin="anonymous"
        referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels" crossorigin="anonymous"
        referrerpolicy="no-referrer"></script>

    <script src="{{ asset('assets/principal/js/dashboard.js') }}?v={{ filemtime(public_path('assets/principal/js/dashboard.js')) }}"></script>
@endsection
