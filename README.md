# BIIGLE Projects Module

This is the BIIGLE module to create, edit and manage projects.

## Installation

1. Run `composer config repositories.projects vcs git@github.com:biigle/projects.git`
2. Run `composer require biigle/projects`.
3. Add `Biigle\Modules\Projects\ProjectsServiceProvider::class` to the `providers` array in `config/app.php`.
4. Run `php artisan vendor:publish --tag=public` to publish the public assets of this module.

## Developing

Take a look at the [development guide](https://github.com/biigle/core/blob/master/DEVELOPING.md) of the core repository to get started with the development setup.

Want to develop a new module? Head over to the [biigle/module](https://github.com/biigle/module) template repository.

## Contributions and bug reports

Contributions to BIIGLE are always welcome. Check out the [contribution guide](https://github.com/biigle/core/blob/master/CONTRIBUTING.md) to get started.
