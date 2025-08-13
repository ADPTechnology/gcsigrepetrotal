@extends('principal.common.layouts.masterpage')

@section('content')
    <div class="row content">

        <div class="title-page-header">
            <div class="card page-title-container">
                <div class="card-header">
                    <div class="total-width-container">
                        <h4>Stock</h4>
                    </div>
                </div>
            </div>

            <div class="principal-container card-body card z-index-2">

                <input type="hidden" id="excel-generated-wastespg-info" data-name='{{ Auth::user()->name }}'>

                <div class="mb-4" id="btn-register-packing-guide-container"
                    data-send="{{ route('selectWasteStock.manager') }}"
                    data-url="{{ route('loadGuidesSelected.manager') }}">

                    @include('principal.viewManager.packingGuides.partials.components._button_stock')
                </div>

                <div class="group-filter-buttons-section">

                    <input type="hidden" id="max_date_stock" name="max_date_stock" value="{{ $max_date_stock }}">
                    <input type="hidden" id="min_date_stock" name="min_date_stock" value="{{ $min_date_stock }}">

                    <div class="datepicker-range-container input-daterange d-flex flex-wrap" id="stock-datepicker">
                        <span class="datepicker-label">
                            Desde:
                        </span>
                        <input type="text" class="input-sm form-control" name="fromDate" id="fromDateSelectStock" />
                        <span class="datepicker-label">
                            Hasta:
                        </span>
                        <input type="text" class="input-sm form-control" name="toDate" id="toDateSelectStock" />
                    </div>

                    <div>
                        <label class="form-label">Filtrar por Manejo/Gestión: &nbsp;</label>
                        <div class="selectgroup">
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-wastespg" value="all" class="selectgroup-input"
                                    checked>
                                <span class="selectgroup-button selectgroup-button-icon">TODO</span>
                            </label>
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-wastespg" value="0" class="selectgroup-input">
                                <span class="selectgroup-button selectgroup-button-icon">PENDIENTE</span>
                            </label>
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-wastespg" value="1" class="selectgroup-input">
                                <span class="selectgroup-button selectgroup-button-icon">GESTIONADO</span>
                            </label>
                        </div>
                    </div>

                    {{-- <div>
                        <label class="form-label">Filtrar por saldo: &nbsp;</label>
                        <div class="selectgroup">
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-residualpg" value="all" class="selectgroup-input"
                                    checked>
                                <span class="selectgroup-button selectgroup-button-icon">TODO</span>
                            </label>
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-residualpg" value="1" class="selectgroup-input">
                                <span class="selectgroup-button selectgroup-button-icon">SALDO</span>
                            </label>
                        </div>
                    </div> --}}

                </div>

                <div class="group-filter-buttons-section">
                    <div>
                        <div class="selectgroup">
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-selected-stock" value="all" class="selectgroup-input"
                                    checked>
                                <span class="selectgroup-button selectgroup-button-icon">TODO</span>
                            </label>
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-selected-stock" value="selected"
                                    class="selectgroup-input">
                                <span class="selectgroup-button selectgroup-button-icon">SELECCIONADOS</span>
                            </label>
                        </div>
                    </div>
                </div>

                <form>

                    <div id="filters-container" class="group-filter-buttons-section">

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Punto Verde</label>

                            <div>
                                <select name="warehouse" class="form-control select2 waste_internment_select"
                                    id="waste_warehouse_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Empresa</label>

                            <div>
                                <select name="company" class="form-control select2 waste_internment_select"
                                    id="waste_company_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Código</label>

                            <div>
                                <select name="code" class="form-control select2 waste_internment_select"
                                    id="waste_code_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Clase</label>

                            <div>
                                <select data-url="{{ route('loadWasteTypes.manager') }}" name="waste_class_select"
                                    class="form-control select2" id="waste_stock_class_select">
                                    <option></option>
                                    @foreach ($waste_classes as $waste_class)
                                        <option value="{{ $waste_class->id }}">{{ $waste_class->symbol }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Residuo</label>

                            <div class="select-disabled container-select">
                                <select name="waste_type_select" class="form-control select2"
                                    id="waste_stock_type_select">
                                    <option></option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Grupo</label>

                            <div>
                                <select name="group" class="form-control select2 waste_internment_select"
                                    id="waste_group_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                    </div>

                </form>

                {{-- <div class="group-filter-buttons-section">

                    <div class="form-group col-2 p-0 select-group">
                        <label class="form-label">Filtrar por Empresa</label>

                        <div>
                            <select name="company_select" class="form-control select2" id="waste_company_select">
                                <option></option>
                                @foreach ($companies as $company)
                                    <option value="{{ $company->id }}">{{ $company->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-2 p-0 select-group">
                        <label class="form-label">Filtrar por tipo de embalaje</label>

                        <div>
                            <select name="package_type_select" class="form-control select2"
                                id="waste_package_type_select">
                                <option></option>
                                @foreach ($package_types as $package_type)
                                    <option value="{{ $package_type->id }}">{{ $package_type->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-2 p-0 select-group">
                        <label class="form-label">Filtrar por Clase</label>

                        <div>
                            <select data-url="{{ route('loadWasteTypes.manager') }}" name="waste_class_select"
                                class="form-control select2" id="waste_stock_class_select">
                                <option></option>
                                @foreach ($waste_classes as $waste_class)
                                    <option value="{{ $waste_class->id }}">{{ $waste_class->symbol }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-2 p-0 select-group">
                        <label class="form-label">Filtrar por Residuo</label>

                        <div class="select-disabled container-select">
                            <select name="waste_type_select" class="form-control select2" id="waste_stock_type_select">
                                <option></option>
                            </select>
                        </div>
                    </div>
                </div> --}}

                <form action="{{ route('exportWastes.manager') }}" id="form-internment-wastes-report" method="GET">
                    <input type="hidden" name="from_date" value="">
                    <input type="hidden" name="end_date" value="">
                    <input type="hidden" name="status" value="all">

                    {{-- <div class="mb-4">
                        <button type="submit" class="btn btn-success" id="btn-export-internment-wastes-report">
                            <i class="fa-solid fa-download"></i> &nbsp; Descargar Excel
                            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                        </button>
                    </div> --}}
                </form>

                <table id="interment-wastes-table-manager" class="table table-hover"
                    data-url="{{ route('stock.index') }}">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Ítem</th>
                            <th>Nro. Guía</th>
                            <th>Fecha</th>
                            <th>Punto Verde</th>
                            <th>Empresa</th>
                            <th>Código</th>
                            <th>Residuo</th>
                            <th>Clase</th>
                            <th>Grupo</th>
                            <th>Gestión</th>
                            <th>Peso (Kg)</th>
                            <th>Estado Manejo Boleano</th>
                            <th>Estado Manejo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                </table>

                <div>
                    <div class="form-group col-1 p-0 mt-2">
                        <label>Total Peso (Kg)</label>
                        <input data-url="{{ route('getWastesTotalWeight.manager') }}" class="form-control disabled"
                            id="total_weight_count_stock" type="text" readonly
                            style="pointer-events: none; min-width: max-content;">
                    </div>
                </div>

                <hr class="mb-5">


                <div class="mb-4" id="btn-update-departure-container"
                    data-url="{{ route('loadGuidesSelected.manager') }}"
                    data-send="{{ route('selectPackingGuide.manager') }}">

                    @include('principal.viewManager.packingGuides.partials.components._button_pckguide')
                </div>

                <div class="group-filter-buttons-section">

                    <input type="hidden" id="max_date_depart" name="max_date_depart" value="{{ $max_date_depart }}">
                    <input type="hidden" id="min_date_depart" name="min_date_depart" value="{{ $min_date_depart }}">

                    <div class="datepicker-range-container input-daterange d-flex flex-wrap" id="departure-datepicker">
                        <span class="datepicker-label">
                            Desde:
                        </span>
                        <input type="text" class="input-sm form-control" name="fromDate"
                            id="fromDateSelectDeparture" />
                        <span class="datepicker-label">
                            Hasta:
                        </span>
                        <input type="text" class="input-sm form-control" name="toDate" id="toDateSelectDeparture" />
                    </div>

                    <div>
                        <label class="form-label">Filtrar por Estado Manejo: &nbsp;</label>
                        <div class="selectgroup">
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-wastes-departure" value="all"
                                    class="selectgroup-input" checked>
                                <span class="selectgroup-button selectgroup-button-icon">TODO</span>
                            </label>
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-wastes-departure" value="0"
                                    class="selectgroup-input">
                                <span class="selectgroup-button selectgroup-button-icon">PENDIENTE</span>
                            </label>
                            <label class="selectgroup-item">
                                <input type="radio" name="filter-wastes-departure" value="1"
                                    class="selectgroup-input">
                                <span class="selectgroup-button selectgroup-button-icon">GESTIONADO</span>
                            </label>
                        </div>
                    </div>

                </div>

                <form>

                    <div class="group-filter-buttons-section">

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Clase</label>

                            <div>
                                <select data-url="{{ route('loadWasteTypes.manager') }}" name="waste_class_select_departure"
                                    class="form-control select2" id="waste_departure_class_select">
                                    <option></option>
                                    @foreach ($waste_classes as $waste_class)
                                        <option value="{{ $waste_class->id }}">{{ $waste_class->symbol }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Residuo</label>

                            <div class="select-disabled container-select">
                                <select name="waste_type_select_departure" class="form-control select2"
                                    id="waste_departure_type_select">
                                    <option></option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Grupo</label>

                            <div>
                                <select name="group" class="form-control select2 waste_departure_select"
                                    id="waste_group_select_departure" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                    </div>

                </form>

                <form action="{{ route('exportWastesDepartures.manager') }}" id="form-departures-wastes-report"
                    method="GET">
                    <input type="hidden" name="from_date" value="">
                    <input type="hidden" name="end_date" value="">
                    <input type="hidden" name="status" value="all">

                    {{-- <div class="mb-4">
                        <button type="submit" class="btn btn-success" id="btn-export-departures-wastes-report">
                            <i class="fa-solid fa-download"></i> &nbsp; Descargar Excel
                            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                        </button>
                    </div> --}}
                </form>

                <table id="packing-guides-table-manager" class="table table-hover"
                    data-url="{{ route('stock.index') }}">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Cod. Guía Interna</th>
                            <th>Cod. Manejo Interno</th>
                            <th>Grupo</th>
                            <th>Tipo de Residuo</th>
                            <th>Peso (kg)</th>
                            <th>Volum (Opc)</th>
                            <th>Tipo de Manejo</th>
                            <th>Estado de Manejo</th>
                            <th>Fecha de Manejo</th>
                            <th>Año Mes</th>
                            <th>Comentario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                </table>

            </div>
        </div>

    </div>
@endsection

@section('modals')
    <div class="modal fade" id="RegisterPackingGuideModal" tabindex="-1" aria-labelledby="RegisterPackingGuideModal"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-wastes">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="RegisterPackingGuideModalTitle">
                        <div class="section-title mt-0">
                            <i class="fa-solid fa-layer-group"></i> &nbsp;
                            <span id="txt-context-element">
                                Realizar Grupo
                            </span>
                        </div>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"> &times; </span>
                    </button>
                </div>

                <form action="{{ route('stock.storePg.manager') }}" id="register-pg-manager-form" method="POST">
                    @csrf

                    <div class="modal-body">

                        <div class="text-bold p-2 mb-2 subtitle">
                            Residuos seleccionados:
                        </div>

                        <div style="overflow: auto;">
                            <table id="guides-pg-manager-table" class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nro. Guía</th>
                                        <th>Clase</th>
                                        <th>Residuo</th>
                                        {{-- <th>Tipo de embalaje</th> --}}
                                        <th>Peso (Kg)</th>
                                        {{-- <th>Nro. Bultos</th> --}}
                                        <th>Empresa</th>
                                        <th>Fecha de Guía</th>
                                        <th>Manejo/Gestión</th>
                                        {{-- <th>Estado Salida</th>
                                        <th>Estado Llegada</th>
                                        <th>Estado Salida de Pucallpa</th>
                                        <th>Estado Disposición</th> --}}
                                    </tr>
                                </thead>

                                <tbody id="t-body-guides-pg-manager">

                                </tbody>

                            </table>

                        </div>



                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label> Peso Total:</label>
                                <div id="total-weight-pg-manager" class="disabled-txt-input">
                                </div>
                            </div>

                            <div class="form-group col-md-4">
                                <label for="inputGuideCode">Cod. Guía Manejo *</label>
                                <input type="text" name="code" class="form-control"
                                    placeholder="Ingresar guía interna" required>
                            </div>

                            <div class="form-group col-md-4">
                                <label for="management-type-select">Tipo de Manejo Interno *</label>
                                <select name="inter_management_id" id="management-type-select"
                                    class="form-control select2" required>
                                    <option></option>
                                    @foreach ($managements_types as $type)
                                        <option value="{{ $type->id }}">{{ $type->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label>Fecha de Manejo Interno *</label>
                                <div class="input-group">
                                    <input type="text" name="date" class="form-control datetimepicker" required>
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">
                                            <i class="fa-solid fa-calendar-days"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="inputVolume">Volum (Opc) *</label>
                                <input type="text" pattern="^-?[0-9]+(\.[0-9]+)?|-?$" name="volume"
                                    class="form-control" placeholder="Ingresar volumen" required>
                            </div>

                        </div>

                        <div class="form-row">

                            <div class="form-group col-12">
                                <label> Comentario (opcional):</label>
                                <input type="text" name="comment" class="form-control">
                            </div>

                        </div>

                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary btn-save">
                            Guardar
                            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                        </button>
                    </div>


                </form>

            </div>



        </div>
    </div>

    @include('principal.viewManager.packingGuides.partials.modals._show-internment-guide')

    {{-- * ----------- EDIT STOCK ------------ --}}
    @include('principal.viewAdmin.generatedWastes.partials.modals._edit')

    {{-- *----------- PARTITIONS STOCK ------------ --}}
    {{-- @include('principal.viewManager.packingGuides.partials.modals._stock-partition') --}}

    @include('principal.viewManager.packingGuides.partials.modals._show-packing-guide')


    <div class="modal fade" id="updateDeparturePgModal" tabindex="-1" aria-labelledby="updateDeparturePgModal"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-wastes">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="RegisterPackingGuideModalTitle">
                        <div class="section-title mt-0">
                            <i class="fa-solid fa-truck-moving"></i> &nbsp;
                            <span id="txt-context-element">
                                Realizar Manejo Interno
                            </span>
                        </div>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"> &times; </span>
                    </button>
                </div>

                <form action="{{ route('updatePackingGuideDeparture.manager') }}" id="updateDeparture-pg-manager-form"
                    method="POST">
                    @csrf

                    <div class="modal-body">

                        <div class="text-bold p-2 mb-2 subtitle">
                            Guías Seleccionados:
                        </div>

                        <div style="overflow: auto;">
                            <table id="guides-departure-manager-table" class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Registro de salida de los residuos</th>
                                        <th>Peso total (Kg)</th>
                                        <th>Total bultos</th>
                                        <th>Volumen (m3)</th>
                                        <th>Fecha de salida de los residuos</th>
                                        <th>Estado salida</th>
                                        <th>Estado llegada</th>
                                    </tr>
                                </thead>

                                <tbody id="t-body-guides-departure-manager">
                                </tbody>

                            </table>
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label for="transport-type-select">Tipo de transporte *</label>
                                <select name="transport-type" id="transport-type-select" class="form-control select2"
                                    required>
                                    <option></option>
                                    <option value="Aéreo">Aéreo</option>
                                    <option value="Fluvial">Fluvial</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label>Fecha de salida Malvinas *</label>
                                <div class="input-group">
                                    <input type="text" name="date" class="form-control datetimepicker" required>
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">
                                            <i class="fa-solid fa-calendar-days"></i>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="form-group col-md-4">
                                <label for="destination-select">Destino de la carga *</label>
                                <select name="destination" id="destination-select" class="form-control select2" required>
                                    <option></option>
                                    <option value="Lima">Lima</option>
                                    <option value="Pucallpa">Pucallpa</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">

                            <div class="form-group col-md-6">
                                <label for="transport-type-select">N° de Guía PPC *</label>
                                <input type="text" name="n-guideppc" class="form-control" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label>N° de Manifiesto *</label>
                                <input type="text" name="n-manifest" class="form-control" maxlength="10000" required>
                            </div>
                        </div>

                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary btn-save">
                            Guardar
                            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                        </button>
                    </div>


                </form>

            </div>



        </div>
    </div>

    @include('principal.viewManager.packingGuides.partials.modals._edit-packing-guide')
@endsection
