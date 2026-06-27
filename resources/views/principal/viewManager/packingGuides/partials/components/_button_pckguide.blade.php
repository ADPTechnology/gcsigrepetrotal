@if (!empty($session_pckguides_ids))
    <button id="btn-update-departure-modal" class="btn btn-primary">
        <i class="ti ti-square-rounded-plus-filled"></i> &nbsp; <span class="me-1"> Realizar Manejo </span>
        <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
    </button>
@else
    <div class="btn btn-secondary" style="pointer-events: none;">
        <i class="ti ti-square-rounded-plus-filled"></i> &nbsp; <span class="me-1"> Realizar Manejo </span>
    </div>
@endif
