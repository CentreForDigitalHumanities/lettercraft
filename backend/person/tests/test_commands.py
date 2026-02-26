from django.core.management import call_command

def test_agents_import_export(db, agent_description, agent_description_2, historical_person, tmp_path):
    filepath = tmp_path / 'agents.csv'
    call_command('export_agents', filepath)

    with open(filepath, 'r') as f:
        content = f.readlines()
        assert len(content) == 3

    assert content[1].endswith(',' + historical_person.name + '\n')
    content[1] = content[1].replace(
        ',' + historical_person.name + '\n',
        ',' + 'Grover' + '\n',
    )

    with open(filepath, 'w') as f:
        f.writelines(content)

    call_command('import_agents', filepath)

    agent_description.refresh_from_db()
    assert agent_description.describes.count() == 1
    assert agent_description.describes.first().name == 'Grover'
