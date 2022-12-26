clear;
clf;

[x,y] = meshgrid(-3.5:0.01:3.5,-3.5:0.01:3.5);
z = x+i*y;
R = 1+z+0.5*z.^2+(1/6)*z.^3+(1/24)*z.^4;
R2 = 1+z+0.5*z.^2;
R3 = 1+z;
zlevel = abs(R);
zlevel2 = abs(R2);
zlevel3 = abs(R3);
contour(x,y,zlevel,[1 1],'g','linewidth',3);
hold on
contour(x,y,zlevel2,[1 1],'g','linewidth',1);
contour(x,y,zlevel3,[1 1],'g','linewidth',1);
plot([-4,4],[0,0],'k','linewidth',3);
plot([0,0],[-4,4],'k','linewidth',3);
