# AI Service reporter

AI Service reporter is a web application that uses AI to parse messages from publishers
and generates a table with the result. This table can then be exported to a csv or excel file.

## State management

The application should follow the flux pattern.
Components shall not contain business logic.

Instead all logic should be placed in classes with svelte 5 $state and $derive.

Components receive props and events (in the form of function props) are sent to parent components.

State is connected to components at the top level.

### Persisted data

Data is to be persisted. Settings are persisted in local storage.

Publishers and reports are persisted in IndexedDB.

pubhlishers and reports should be stored in different tables, and each report have a link to the publisher.

## File structure

Components are placed in src/lib/components. And state management in src/lib/state.

When importing components, use the $lib alias instead of relative imports.

unit tests are stored next to the component or class they test, with the same name but with a .test.ts suffix.

## Main page (main interface)

The main interface contains the following elements:

- a text input field for pasting multiple messages as received from publishers
- a button to trigger the parsing of the messages
- table view to display the parsed results.
- A button for exporting to excel or csv
- A button to clear the reports. It should only report data, not the names. The user must confirm before it's cleared.

### Table view

The table view should have the following columns:

- Name, The name of the publisher
- Active, yes or no. If the publisher have not yet given a report it's empty.
- hours, the number of hours spent in service. It can be empty
- studies, Number of a publisher have.
- Comment, can contain any comment the publisher have given. It can be empty.

All fields are editable.

Above the table there is a button to toggle "edit mode".
In edit mode the user can delete rows and create new publishers. If edit mode is activated
there are an empty row at the bottom of the table. If a name is entered here, a new publisher is created
and a new empty row is added. Besides each row there is a delete button to delete the row.

When not in edit mode, the user can only edit existing rows.

## Settings page

This page allows the user to edit settings.
Settings are persisted in local storage, and saved whenever the user clicks a save button.

Available settings are:

- Key for AI service

## Header

All pages share a header with the name of the application and a link to the settings page.
If not on the main page, there is a "back" link beside the application name to return to the main page.

## AI integration

When the parse button is clicked, the messages are sent to the AI service for parsing.

In addition to the messages, the list with existing publishers and existing data are also
included in the prompt.

the prompt to be used is specified in @reports.prompt.yml
