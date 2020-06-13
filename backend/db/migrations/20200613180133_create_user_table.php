<?php

use Phinx\Migration\AbstractMigration;

class CreateUserTable extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html
     *
     * The following commands can be used in this method and Phinx will
     * automatically reverse them when rolling back:
     *
     *    createTable
     *    renameTable
     *    addColumn
     *    addCustomColumn
     *    renameColumn
     *    addIndex
     *    addForeignKey
     *
     * Any other destructive changes will result in an error when trying to
     * rollback the migration.
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change()
    {
        $users = $this->table('users');
        $users->addColumn('first_name', 'string', ['limit' => 128]);
        $users->addColumn('last_name', 'string', ['limit' => 128]);
        $users->addColumn('email_address', 'string', ['limit' => 128]);
        $users->addColumn('password_digest', 'string', ['limit' => 60]);
        $users->addColumn('created_at', 'datetime');
        $users->addIndex(['email_address'], ['unique' => true]);
        $users->create();
    }
}
