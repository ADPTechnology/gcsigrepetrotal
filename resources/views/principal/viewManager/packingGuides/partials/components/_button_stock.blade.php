@if (!empty($session_stock_ids))
    <button id="btn-register-pg-modal" class="btn btn-primary">
        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1">Realizar Grupo</span>
        <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
    </button>
@else
    <div class="btn btn-secondary" style="pointer-events: none;">
        <i class="fa-solid fa-square-plus"></i> &nbsp;
        <span class="me-1">Realizar Grupo</span>
    </div>
@endif
