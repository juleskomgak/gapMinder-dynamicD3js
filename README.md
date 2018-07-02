# gapMinder-dynamicD3js
Steps for project :
1: Take a look at the data that we're working with in your browser console. 
If there are any null values for one of the countries in one of the years, 

use a filter on the array to exclude that country-year data point from the dataset.
2: Make a static scatter plot for the first year in our data.
        a) Set up some sensible dimensions for your visualization, and make it conform to the D3 margin convention.
        b) Write scales for each axis (GDP-per-capita on the x-axis, life expectancy on the y-axis)
            Suggested domains: x – [300, 150000] ; y – [0, 90] .
            The x scale should be a logarithmic scale.
        c) Append both axes with D3's axis generators.
            Use TickValues() to manually set our x-axis values of 400, 4,000, and 40,000.
        d) Append circles for each country in one year (e.g. the first year of our data)
3: Write an update()  function that makes use of the JOIN/EXIT/UPDATE/ENTER pattern discussed in this section.
        The data join needs to contain a key function linking it to individual countries, or else it won’t work.
        Put a transition on the update function of 100ms (it can’t be larger than the d3.interval time).
4: Add a loop with d3.interval() , calling the update()  function on each iteration of the loop.
        On each run of the update()  function, you should be passing in a different array of countries.
        The visualization should go from 1800 to 2015, then reset itself – how could you achieve this with something like our “flag” variable?
6: Change the radius dynamically so that it represents the population of the given country in a given year.
      a) You’ll need to use another scale for this (the range should be [5, 25]).
        Make sure to associate population with the area, rather than the radius of the circle! You might need to play around with this         scale to find the right transformation to use. (Hint: Area = PI * Radius^2)
    Change the fill of the circles to associate them to their continent.
        You’ll need to write an ordinal scale to do this. Use one of the D3 color schemes to make things simpler.
 7: Add axis labels to the x and y axis, and a year marker that updates with every run of the update loop.
