@extends('manual.base')

@section('manual-title') Notifications @stop

@section('manual-content')
    <div class="row">
        <p class="lead">
            Everything about the notification center.
        </p>
        <p>
            Notifications are an alternative to sending emails to inform you of an event like the completion of a longer running task that you have submitted in BIIGLE. All your notifications are collected in your notification center. You can visit the notification center with a click on the <span class="glyphicon glyphicon-bell" aria-hidden="true"></span> symbol in the navbar at the top. If you have (new) unread notifications the symbol is highlighted with a flashing blue dot.
        </p>
        <p>
            The default view of the notification center shows all unread notifications. Each notification consists of a title, a short message and an optional action link like this:
        </p>
        <div id="sample-notification" class="panel panel-default">
            <div class="panel-heading">
                <span class="pull-right">
                    <span>1 minute ago</span>
                    <button class="btn btn-default btn-xs" title="Mark as read"><i class="glyphicon glyphicon-ok"></i></button>
                </span>
                <h3 class="panel-title">Notification title</h3>
            </div>
            <div class="panel-body">
                Notification message
                <p class="notification__action">
                    <a>Action link</a>
                </p>
            </div>
        </div>
        <p>
            A click on the action link usually transfers you directly to the cause of the notification (like a new system message or a downloadable file). You can mark unread notifications as read by clicking on the <button class="btn btn-default btn-xs" title="Mark as read"><i class="glyphicon glyphicon-ok"></i></button> button. This will make the message immediately disappear from the list of unread notifications. To view older notifications that were already marked as read, click the "All notifications" link in the navigation on the left of the notification center.
        </p>
        <p>
            Whenever a new system message is published, all users will get a notification to read it. In contrast to ordinary notifications, notifications of system messages are colored to reflect the type of the system message (<span class="label label-warning">important</span>, <span class="label label-success">update</span> or <span class="label label-info">info</span>). Click <a href="#" onclick="return getColorful()">here</a> to give the notification above a color.
        </p>
        <script type="text/javascript">
            (function () {
                var index = 0;
                var colors = ['panel-warning', 'panel-success', 'panel-info'];
                window.getColorful = function () {
                    var notification = document.getElementById('sample-notification');
                    notification.className = 'panel ' + colors[index++ % colors.length];
                    return false;
                }
            })();
        </script>
    </div>
@endsection