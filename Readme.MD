#  ![](https://test-logs-analyzer.web.cern.ch/favicon.ico) Logs Analyzer 
___
This tool is used to debug cern dialtone web application by importing logs as JSON format.
Logs Analyzer have been made by using ReactJS.
# Development installation
This application requires **npm**.
https://nodejs.org/en/ (Downloads page)
Once installed you will need to **git clone**:
```
git clone https://github.com/cern-dialtone/phone-logs-analyzer.git path/to/your/directory
```
Once this done, enter in the cloned directory and run:
```
npm install
```
This command will install required dependencies located in **package.json**.

Then, all you need to do is run a server.
```
npm start
```
---

# How does the application work ?
**Logs analyzer** needs a JSON format to proceed (file or text). To do so, you can upload or paste a json file.
It will interpret it and render 3 principals elements:
- Interpreter
- Filters
- Timeline


#### Interpreter
The **interpreter** will display json information as readable as possible.
Once the JSON loaded, it will be sorted by time (no matter what logs order you have) beginning with the earliest.
You can sort that list ( = reverse it) by clicking on 'Time' category.
It may display a background color if there is a 'color' attribute in your array row.
If an array row contains objects, they will be displayed if you click on 'show more' (Like big information).

#### Filters
**Filters** will change interpreter's display by showing data according to applied filters.
You can type words in the search bar, it will look for them in column 'type' and 'infos'. The search bar is not case sensitive.
typing 'TONE_IN' in search bar is the same as selecting 'TONE_IN' in the filter bar.
You can reset all filters (TimeLine too) by clicking on 'reset all filters'.

#### TimeLine
By overing the timeline with your cursor you will see interpreter updating. It will show logs referring to the timeline black bar position.
