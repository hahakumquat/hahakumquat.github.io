import numpy as np

xs = np.linspace(0, 100, 200)
ys = np.sin(xs / 10) * 2 + 2
ys += np.random.normal(size=len(ys))
ys -= min(ys)
data = [{"x":float(xs[i]), "y":float(ys[i])} for i in range(len(xs))]

with open("sin-data.csv", "w") as out:
    out.write('x,y\n')
    for i in range(len(data)):
        out.write(str(data[i]['x']) + ',' + str(data[i]['y']) + '\n')

