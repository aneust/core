<?php

namespace Dias\Policies;

use Dias\AnnotationLabel;
use Dias\User;
use Dias\Role;
use DB;
use Illuminate\Auth\Access\HandlesAuthorization;

class AnnotationLabelPolicy extends CachedPolicy
{
    use HandlesAuthorization;

    /**
     * Intercept all checks
     *
     * @param User $user
     * @param string $ability
     * @return bool|null
     */
    public function before($user, $ability)
    {
        if ($user->isAdmin) {
            return true;
        }
    }

    /**
     * Determine if the user can edit the given annotation label.
     *
     * If the user created the annotation label, they must be editor or admin of one
     * of the projects, the annotation belongs to. If another user created it, they must
     * be admin of one of the projects.
     *
     * @param  User  $user
     * @param  AnnotationLabel  $annotationLabel
     * @return bool
     */
    public function update(User $user, AnnotationLabel $annotationLabel)
    {
        return $this->remember("annotation-label-can-update-{$user->id}-{$annotationLabel->id}", function () use ($user, $annotationLabel) {
            $annotation = $annotationLabel->annotation;
            // selects the IDs of the projects, the annotation belongs to
            $projectIdsQuery = function ($query) use ($annotation) {
                $query->select('project_transect.project_id')
                    ->from('project_transect')
                    ->join('images', 'project_transect.transect_id', '=', 'images.transect_id')
                    ->where('images.id', $annotation->image_id);
            };

            if ((int) $annotationLabel->user_id === $user->id) {
                // editors and admins may detach their own labels
                return DB::table('project_user')
                    ->where('user_id', $user->id)
                    ->whereIn('project_id', $projectIdsQuery)
                    ->whereIn('project_role_id', [Role::$editor->id, Role::$admin->id])
                    ->exists();
            } else {
                // only admins may detach labels other than their own
                return DB::table('project_user')
                    ->where('user_id', $user->id)
                    ->whereIn('project_id', $projectIdsQuery)
                    ->where('project_role_id', Role::$admin->id)
                    ->exists();
            }
        });
    }

    /**
     * Determine if the user can delete the given annotation label.
     *
     * If the user created the annotation label, they must be editor or admin of one
     * of the projects, the annotation belongs to. If another user created it, they must
     * be admin of one of the projects.
     *
     * @param  User  $user
     * @param  AnnotationLabel  $annotationLabel
     * @return bool
     */
    public function destroy(User $user, AnnotationLabel $annotationLabel)
    {
        return $this->update($user, $annotationLabel);
    }
}