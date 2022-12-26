
clear;

h=linspace(0,3,100);
omega = 1;
L=i*omega;
R = 1+h*L+h.^2/2*L^2+h.^3/6*L^3+h.^4/24*L^4;

plot(h,abs(R));