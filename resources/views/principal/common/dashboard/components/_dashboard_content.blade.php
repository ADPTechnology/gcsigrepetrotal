<div class="principal-container card-body card z-index-2">

    <form action="{{ $route }}" id="dashboard_filters_action">

        <input type="hidden" id="max_date" name="max_date" value="{{ $max_date }}">
        <input type="hidden" id="min_date" name="min_date" value="{{ $min_date }}">

        <div class="form-row justify-content-between" id="selects-container-edit">

            <div class="form-group">

                <div class="datepicker-range-container input-daterange input-group" id="datepicker">

                    <span class="datepicker-label">
                        Desde:
                    </span>

                    <input type="text" class="input-sm form-control" name="fromDate" id="fromDateSelect" />

                    <span class="datepicker-label">
                        Hasta:
                    </span>

                    <input type="text" class="input-sm form-control" name="toDate" id="toDateSelect" />

                </div>
            </div>


            {{-- <div class="form-group">

                            <div class="form-group date-range-container">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <a href="javascript:;" id="reportrange"
                                            class="btn btn-primary icon-left btn-icon pt-2">
                                            <i class="fas fa-calendar"></i>
                                            Elegir Fecha
                                        </a>
                                    </div>
                                    <input type="text" name="date-range" class="form-control date-range-input"
                                        id="reportrange_input" disabled>
                                </div>

                            </div>

                            {{-- <div class="d-flex flex-wrap date-select-container">

                                <select data-url="{{ route('dashboard.getMonths') }}" name="year" style="max-width: 120px;"
                                    class="form-control select2" id="year_dashboard_select" required>
                                    @foreach ($years as $year)
                                        <option value="{{ $year }}" @if ($loop->last) selected @endif>
                                            {{ $year }}</option>
                                    @endforeach
                                </select>

                                <select name="months[]" class="form-control select2" id="months_dashboard_select" multiple required>
                                    @include('principal.common.dashboard.components._month_options')
                                </select>
                            </div>

                        </div> --}}

            <div class="form-group">
                <div class="form-group">
                    <div class="form-control totalize-cont">
                    </div>
                </div>
            </div>


        </div>

        <div class="form-row" style="gap: 1em;">

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Lotes</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>

                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($lots as $lot)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots[]" value="{{ $lot->id }}" class="selectgroup-input"
                                checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $lot->name }}">{{ $lot->name }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

            {{-- <div class="form-group">

                            <div class="d-flex align-items-center justify-content-between mb-1">

                                <label class="form-label with_options_chk">Etapa</label>

                                <div class="selectgroup selectgroup-pills options_select">

                                    <label class="selectgroup-item mb-1">
                                        <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options" checked>
                                        <span class="selectgroup-button">
                                            <i class="fa-solid fa-list-check"></i>
                                        </span>
                                    </label>
                                </div>

                            </div>

                            <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                                @foreach ($stages as $stage)
                                <label class="selectgroup-item mb-1">
                                    <input type="checkbox" name="stages[]" value="{{ $stage->id }}" class="selectgroup-input"
                                        checked>
                                    <span class="selectgroup-button truncated" title="{{ $stage->name }}">{{ $stage->name }}</span>
                                </label>
                                @endforeach

                            </div>
                        </div> --}}

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Locación</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($locations as $location)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="locations[]" value="{{ $location->id }}"
                                class="selectgroup-input" checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $location->name }}"">{{ $location->name }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Área</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($projects as $project)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="projects[]" value="{{ $project->id }}"
                                class="selectgroup-input" checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $project->name }}">{{ $project->name }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Empresa</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($companies as $company)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="companies[]" value="{{ $company->id }}"
                                class="selectgroup-input" checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $company->name }}">{{ $company->name }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

            {{-- <div class="form-group">

                            <div class="d-flex align-items-center justify-content-between mb-1">
                                <label class="form-label with_options_chk">Frente</label>

                                <div class="selectgroup selectgroup-pills options_select">

                                    <label class="selectgroup-item mb-1">
                                        <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options" checked>
                                        <span class="selectgroup-button">
                                            <i class="fa-solid fa-list-check"></i>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                                @foreach ($fronts as $front)
                                <label class="selectgroup-item mb-1">
                                    <input type="checkbox" name="fronts[]" value="{{ $front->id }}" class="selectgroup-input"
                                        checked>
                                    <span class="selectgroup-button truncated" title="{{ $front->name }}">{{ $front->name }}</span>
                                </label>
                                @endforeach

                            </div>
                        </div> --}}

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Grupo</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($groups as $group)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="groups[]" value="{{ $group->id }}"
                                class="selectgroup-input" checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $group->name }}">{{ $group->name }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Clase</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($classes as $class)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="classes[]" value="{{ $class->id }}"
                                class="selectgroup-input" checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $class->symbol }}">{{ $class->symbol }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

            <div class="form-group">

                <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="form-label with_options_chk">Nombre de residuo</label>

                    <div class="selectgroup selectgroup-pills options_select">

                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="lots_check_options" class="selectgroup-input check_options"
                                checked>
                            <span class="selectgroup-button">
                                <i class="fa-solid fa-list-check"></i>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="selectgroup selectgroup-pills options_items select-dashboard-checkbox">

                    @foreach ($wasteTypes as $wasteType)
                        <label class="selectgroup-item mb-1">
                            <input type="checkbox" name="wasteTypes[]" value="{{ $wasteType->id }}"
                                class="selectgroup-input" checked>
                            <span class="selectgroup-button truncated"
                                title="{{ $wasteType->name }}">{{ $wasteType->name }}</span>
                        </label>
                    @endforeach

                </div>
            </div>

        </div>

        <button type="submit" class="btn btn-primary btn-save">
            Aplicar
            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
        </button>

    </form>

    <div class="d-flex flex-wrap dashboard_charts_container mt-4">

        {{-- * ----- CHART 0 ---- --}}

        <div id="daily_month_chart_container" class="chart_container horizontal full_width">
            <div class="chart_title">Generación Diaria por mes (Tn)</div>
            <canvas id="daily_month_chart_object"></canvas>
        </div>

        {{-- * ----- CHART 1 ---- --}}

        <div id="month_chart_container" class="chart_container horizontal">
            <div class="chart_title">Generación por mes (Tn)</div>
            <canvas id="month_chart_object"></canvas>
        </div>


        {{-- * ----- CHART 2 ---- --}}


        <div id="lot_chart_container" class="chart_container horizontal">
            <div class="chart_title">Generación por Lote (Kg)</div>
            <canvas id="lot_chart_object"></canvas>
        </div>


        <div class="d-flex flex-column" style="gap: 3em;">

            {{-- * ----- CHART 3 ---- --}}

            {{-- <div id="stage_chart_container"  class="chart_container horizontal">
                            <div class="chart_title">Generación por Etapa (Tn)</div>
                            <canvas id="stage_chart_object"></canvas>
                        </div> --}}

            {{-- * ----- CHART 6 ---- --}}

            <div class="chart_general_container">
                <div class="p-3 d-flex flex-wrap">
                    <div class="form-row pr-2">
                        <div class="col-12">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-calendar-days"></i>
                                    </div>
                                </div>
                                <input type="text" id="type_class_month_picker"
                                    class="form-control bootstrap_datepicker_input"
                                    placeholder="Selecciona un mes y año" readonly>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-save" id="btn-save-chart6">
                        Aplicar
                        <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                    </button>
                </div>

                <div id="group_chart_container" class="chart_container vertical no-border">
                    <div class="chart_title">Generación por grupo (Tn) </div>
                    <canvas id="class_chart_object"></canvas>
                </div>
            </div>

        </div>


        {{-- * ----- CHART 4 ---- --}}

        <div id="project_chart_container" class="chart_container vertical">
            <div class="chart_title">Generación por Área (Kg)</div>
            <canvas id="project_chart_object"></canvas>
        </div>


        {{-- * ----- CHART 5 ---- --}}

        <div id="company_chart_container" class="chart_container vertical">
            <div class="chart_title">Generación por Empresa (Kg)</div>
            <canvas id="company_chart_object"></canvas>
        </div>


        {{-- * ----- CHART 7 ---- --}}

        <div id="waste_chart_container" class="chart_container vertical">
            <div class="chart_title">Generación por Tipo de Residuo (Kg)</div>
            <canvas id="waste_chart_object"></canvas>
        </div>

    </div>

</div>
