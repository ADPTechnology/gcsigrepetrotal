@extends('principal.common.layouts.masterpage')

@section('content')

<div class="title-page-header">
    <div class="card page-title-container">
        <div class="card-header">
            <div class="total-width-container">
                <h4>Transporte</h4>
            </div>
        </div>
    </div>

    <div class="principal-container card-body card z-index-2">

        <input type="hidden" id="excel-generated-departures-info" data-name='{{Auth::user()->name}}'>

        <div class="mb-4 buttons-register-container">
            <div id="btn-register-arrival-container"
                data-url="{{ route('getDepartureDetails.manager') }}">
                <div class="btn btn-secondary" style="pointer-events: none;">
                    <i class="fa-solid fa-square-plus"></i> &nbsp;
                    <span class="me-1">Dar llegada</span>
                </div>
            </div>

            <div id="btn-register-departure-container"
                data-url="{{route('getWastesDepartureDetail.ajax')}}">
                <div class="btn btn-secondary" style="pointer-events: none;">
                    <i class="fa-solid fa-square-plus"></i> &nbsp;
                    <span class="me-1">Dar salida</span>
                </div>
            </div>
        </div>

        <div class="group-filter-buttons-section">

            <input type="hidden" id="max_date" name="max_date" value="{{ $max_date }}">
            <input type="hidden" id="min_date" name="min_date" value="{{ $min_date }}">

            <div class="form-group date-range-container">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <a href="javascript:;" id="daterange-btn-departures-manager"
                            class="btn btn-primary icon-left btn-icon pt-2">
                            <i class="fas fa-calendar"></i>
                            Elegir Fecha de Salida
                        </a>
                    </div>
                    <input type="text" name="date-range" class="form-control date-range-input"
                        id="date-range-input-departures" disabled>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Filtrar por Llegada: &nbsp;</label>
                <div class="selectgroup">
                    <label class="selectgroup-item">
                        <input type="radio" name="filter-departures-stat-arrival" value="" class="selectgroup-input" checked>
                        <span class="selectgroup-button selectgroup-button-icon">TODO</span>
                    </label>
                    <label class="selectgroup-item">
                        <input type="radio" name="filter-departures-stat-arrival" value="pendiente" class="selectgroup-input">
                        <span class="selectgroup-button selectgroup-button-icon">PENDIENTE</span>
                    </label>
                    <label class="selectgroup-item">
                        <input type="radio" name="filter-departures-stat-arrival" value="gestionado" class="selectgroup-input">
                        <span class="selectgroup-button selectgroup-button-icon">GESTIONADO</span>
                    </label>
                </div>
            </div>

            {{-- <div class="form-group">
                <label class="form-label">Filtrar por Salida: &nbsp;</label>
                <div class="selectgroup">
                    <label class="selectgroup-item">
                        <input type="radio" name="filter-departures-stat-departure" value="" class="selectgroup-input" checked>
                        <span class="selectgroup-button selectgroup-button-icon">TODO</span>
                    </label>
                    <label class="selectgroup-item">
                        <input type="radio" name="filter-departures-stat-departure" value="pendiente" class="selectgroup-input">
                        <span class="selectgroup-button selectgroup-button-icon">PENDIENTE</span>
                    </label>
                    <label class="selectgroup-item">
                        <input type="radio" name="filter-departures-stat-departure" value="gestionado" class="selectgroup-input">
                        <span class="selectgroup-button selectgroup-button-icon">GESTIONADO</span>
                    </label>
                </div>
            </div> --}}
        </div>

        <div class="group-filter-buttons-section">

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">N° Guía PPC</label>

                <div>
                    <select name="ppc_guide_select" id="ppc_guide_select"
                            class="form-control select2">
                            <option></option>
                            @foreach ($ppc_collect as $item)
                            <option value="{{ $item->ppc_code ?? '-' }}">{{ $item->ppc_code ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">N° de Manifiesto</label>

                <div>
                    <select name="manifest_select"
                            class="form-control select2" id="manifest_select">
                            <option></option>
                            @foreach ($manifestCollect as $item)
                            <option value="{{ $item->manifest_code ?? '-' }}">{{ $item->manifest_code ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">Registro de salida de residuos</label>

                <div>
                    <select name="waste_departure_select"
                            class="form-control select2" id="waste_departure_select">
                            <option></option>
                            @foreach ($wasteDepartureCollect as $item)
                            <option value="{{ $item->cod_guide ?? '-' }}">{{ $item->cod_guide ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">Tipo de transporte</label>

                <div>
                    <select name="transport_select"
                            class="form-control select2" id="transport_select">
                            <option></option>
                            @foreach ($shippingCollect as $item)
                            <option value="{{ $item->shipping_type ?? '-' }}">{{ $item->shipping_type ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">Destino</label>

                <div>
                    <select name="destination_select"
                            class="form-control select2" id="destination_select">
                            <option></option>
                            @foreach ($destinationCollect as $item)
                            <option value="{{ $item->destination ?? '-' }}">{{ $item->destination ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">N° Guía GC Puerto</label>

                <div>
                    <select name="guide_gc_select"
                            class="form-control select2" id="guide_gc_select">
                            <option></option>
                            @foreach ($guideGcCollect as $item)
                            <option value="{{ $item->gc_code ?? '-' }}">{{ $item->gc_code ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group col-2 p-0 select-group">
                <label class="form-label">Nom. Residuo</label>

                <div>
                    <select name="waste_name_select"
                            class="form-control select2" id="waste_name_select">
                            <option></option>
                            @foreach ($wastesCollect as $item)
                            <option value="{{ $item->name ?? '-' }}">{{ $item->name ?? '-' }}</option>
                            @endforeach
                    </select>
                </div>
            </div>
        </div>


        <table id="departures-table-manager" class="table table-hover" data-url="{{route('departures.index')}}">
            <thead>
                <tr>
                    <th>Elegir</th>
                    {{-- <th>N° Guía de Embalaje</th> --}}
                    <th>N° Guía PPC</th>
                    <th>N° de Manifiesto</th>
                    <th>Registro de salida de residuos</th>
                    <th>Clase</th>
                    <th>Nom. Residuo</th>
                    <th>Peso Real (Kg)</th>
                    <th>Tipo de transporte</th>
                    <th>Destino</th>
                    <th>Fecha de salida Malvinas</th>

                    {{-- <th>clase</th>
                    <th>Nom. Residuo</th>
                    <th>Tipo de embalaje</th>
                    <th>Peso Real (Kg)</th> --}}
                    {{-- <th>N° Bultos</th> --}}
                    {{-- <th>Empresa</th> --}}

                    <th>N° Guía GC Puerto</th>
                    <th>Fecha llegada de Pucallpa</th>
                    <th>Fecha retiro de puerto</th>
                    {{-- <th>N° Guía Green Care</th> --}}
                    {{-- <th>Destino</th>
                    <th>Placa Camión Pucallpa</th>
                    <th>Peso recibido</th> --}}
                    {{-- <th>Dif. Peso Malvinas-Pucallpa</th>
                    <th>Fecha salida de Pucallpa</th> --}}
                    <th>Estado Salida</th>
                    <th>Estado llegada</th>
                    {{-- <th>Estado Disposición</th> --}}
                </tr>
            </thead>
        </table>

        <div>
            <div class="form-group col-1 p-0 mt-2">
                <label>Total Peso Real (Kg)</label>
                <input data-url="{{ route('getWastesTotalWeight.manager') }}" class="form-control disabled"
                        id="total_weight_count_departure" type="text" readonly style="pointer-events: none; min-width: max-content;">
            </div>
        </div>

    </div>
</div>

@endsection

@section('modals')

{{-- @include('principal.viewManager.departures.partials.modals._show_departure_detail') --}}

@include('principal.viewManager.packingGuides.partials.modals._show-packing-guide')


<div class="modal fade" id="RegisterArrivalModal" tabindex="-1" aria-labelledby="RegisterArrivalModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-wastes">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="RegisterArrivalModalTitle">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-truck"></i> &nbsp;
                        <span id="txt-context-element">
                            Dar llegada
                        </span>
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"> &times; </span>
                </button>
            </div>

            <form action="{{route('managerWastesArrival.update')}}" id="register-arrival-form" method="POST">
                @csrf

                <div class="modal-body">

                    <div class="text-bold p-2 mb-2 subtitle">
                        Cargas seleccionadas:
                    </div>

                    <div style="overflow: auto;">

                        <table id="wastes-arrival-manager-table" class="table table-hover">
                            <thead>
                                <tr>
                                    <th>N° Guía PPC</th>
                                    <th>N° de Manifiesto</th>
                                    <th>Registro de Salida de residuos</th>
                                    <th>Peso total (Kg)</th>
                                    <th>Nro. Bultos total</th>
                                    <th>Volumen Total (m3)</th>
                                    <th>Tipo de transporte</th>
                                    <th>Destino</th>
                                    <th>Fecha de salida Malvinas</th>
                                    <th>Estado salida</th>
                                    <th>Estado llegada</th>
                                {{--
                                    <th>Clase</th>
                                    <th>Nom. Residuo</th>
                                    <th>Tipo de embalaje</th>
                                    <th>Peso Real (Kg)</th>
                                    <th>N° Bultos</th>
                                    <th>Empresa</th>
                                    <th>Fecha de salida Malvinas</th> --}}
                                </tr>
                            </thead>

                            <tbody id="t-body-arrival-wastes-manager">

                            </tbody>

                        </table>
                    </div>


                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label>Fecha llegada de Pucallpa *</label>
                            <div class="input-group">
                                <input type="text" name="date-arrival" class="form-control datetimepicker" required>
                                <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-calendar-days"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group col-md-4">
                            <label>Fecha retiro de puerto *</label>
                            <div class="input-group">
                                <input type="text" name="date-retreat" class="form-control datetimepicker" required>
                                <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-calendar-days"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="inputVolume">Nro. Guía GC puerto *</label>
                            <input type="text" name="n-guide-gc" class="form-control"
                                placeholder="Ingresar número de guía" required>
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


@include('principal.viewManager.departures.partials.modals._form_disposition_register')


@endsection
