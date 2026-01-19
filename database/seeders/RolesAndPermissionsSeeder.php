<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'manage communities']);
        Permission::create(['name' => 'manage facilities']);
        Permission::create(['name' => 'manage personnel']);
        Permission::create(['name' => 'manage inventory']);
        Permission::create(['name' => 'manage patients']);
        Permission::create(['name' => 'manage medical cases']);

        // create roles and assign created permissions

        // Staff
        $role = Role::create(['name' => 'Staff']);
        $role->givePermissionTo('manage patients');
        $role->givePermissionTo('manage inventory');

        // Doctor
        $role = Role::create(['name' => 'Doctor']);
        $role->givePermissionTo('manage patients');
        $role->givePermissionTo('manage medical cases');

        // Medical Chief
        $role = Role::create(['name' => 'MedicalChief']);
        $role->givePermissionTo(Permission::all());

        // Admin
        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo(Permission::all());
    }
}
