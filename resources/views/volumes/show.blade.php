@extends('app')
@section('full-navbar', true)
@section('title', $volume->name)

@push('scripts')
    <script type="text/javascript">
        biigle.$declare('volumes.volumeId', {!! $volume->id !!});
        {{-- Add image IDs as array, too, because the ordering is important! --}}
        biigle.$declare('volumes.imageIds', {!! $imageIds->keys() !!});
        biigle.$declare('volumes.imageUuids', {!! $imageIds !!});
        biigle.$declare('volumes.thumbUri', '{{ $thumbUriTemplate }}');
        biigle.$declare('volumes.annotateUri', '{{ route('annotate', '') }}/:id');
        biigle.$declare('volumes.imageUri', '{{ route('image', '') }}/:id');

        biigle.$declare('volumes.userId', {!! $user->id !!});
        biigle.$declare('volumes.isAdmin', @can('update', $volume) true @else false @endcan);

        @can('edit-in', $volume)
            biigle.$declare('volumes.labelTrees', {!!$labelTrees!!});
        @endcan
    </script>
    @mixin('volumesScripts')
@endpush

@push('styles')
    @mixin('volumesStyles')
@endpush

@section('navbar')
<div class="navbar-text navbar-volumes-breadcrumbs">
    @include('volumes.partials.projectsBreadcrumb') / <strong>{{$volume->name}}</strong> <small>(<span id="volume-image-count" v-text="text">{{ $imageIds->count() }}</span>&nbsp;images)</small> @include('volumes.partials.annotationSessionIndicator') @include('volumes.partials.doiIndicator')
</div>
@endsection

@section('content')
<div id="volume-container" class="sidebar-container">
    <sidebar direction="left" v-on:toggle="handleSidebarToggle" v-on:open="handleSidebarOpen" v-on:close="handleSidebarClose">
        @can ('update', $volume)
            <sidebar-tab name="edit" icon="pencil-alt" title="Edit this volume" href="{{ route('volume-edit', $volume->id) }}"></sidebar-tab>
        @endcan
        @can ('edit-in', $volume)
            <sidebar-tab name="labels" icon="tags" title="Toggle image label mode">
                @include('volumes.show.labels')
            </sidebar-tab>
        @endcan
        <sidebar-tab name="filter" icon="filter" title="Filter images" :highlight="filterActive">
            @include('volumes.show.filters')
        </sidebar-tab>
        <sidebar-tab name="sorting" icon="exchange-alt fa-rotate-90" title="Sort images" :highlight="sortingActive">
            @include('volumes.show.sorting')
        </sidebar-tab>
        @mixin('volumesSidebar')
    </sidebar>
    <div class="sidebar-container__content">
        <loader-block v-cloak :active="loading"></loader-block>
        <div class="volume-content__messages">
            <div v-cloak v-if="filterEmpty" class="alert alert-info">
                There are no images matching your filter rules.
            </div>
        </div>
        <image-grid
            empty-url="{{ asset(config('thumbnails.empty_url')) }}"
            ref="imageGrid"
            :selectable="imageLabelMode"
            :images="imagesToShow"
            :initial-offset="initialOffset"
            :selected-label="selectedLabel"
            :show-filenames="showFilenames"
            :show-labels="showLabels"
            :width="{{config('thumbnails.width')}}"
            :height="{{config('thumbnails.height')}}"
            v-on:scroll="handleImageGridScroll"
            ></image-grid>
    </div>
</div>
@endsection