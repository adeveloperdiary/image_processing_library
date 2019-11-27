$(document).ready(function () {
    listData();

    $('#bttn-new-config').on('click', function () {
        $('#addNewConfig').modal()
    });

    $('#add-new-service-config').on('click', function () {
        window.open('/design_cnn?id=' + $.trim($('#rowkey').val()) + "&open=new", '_self');
    });

    $('#model-close').on('click', function () {
        resetModelData();
    });

});

function listData() {
    $.getJSON("/get_project_list", function (data) {
        showList(data);
    });
}


function showList(data) {
    var source = document.getElementById("service-list-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template({"configs": data});
    $('#main-list').html(html);

    var table = $('#config_list').DataTable({
        scrollY: '50vh',
        scrollCollapse: true,
        paging: true,
        searching: true
    });

    $('#config_list tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        window.open('/design_cnn?id=' + data[0] + "&open=existing", '_self');
    });
}

function resetModelData() {
    $('#rowkey').val('');

}